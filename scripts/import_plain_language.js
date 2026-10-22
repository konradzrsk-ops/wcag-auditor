import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const exportsDir = path.join(projectRoot, "exports");
const localesDir = path.join(projectRoot, "src", "locales");

if (!fs.existsSync(localesDir)) {
  fs.mkdirSync(localesDir, { recursive: true });
}

/**
 * Narzędzie do importu zredagowanych fraz prostego języka.
 * Obsługuje pliki:
 *  1. exports/frazy_menu_pulpit_dane.json (priorytet)
 *  2. exports/frazy_menu_pulpit_tabela.csv
 *  3. exports/frazy_menu_pulpit_redakcja.txt
 */
export function importPlainLanguage(customFilePath = null) {
  let entries = [];
  let sourceFormat = "";

  const jsonDefault = path.join(exportsDir, "frazy_menu_pulpit_dane.json");
  const csvDefault = path.join(exportsDir, "frazy_menu_pulpit_tabela.csv");
  const txtDefault = path.join(exportsDir, "frazy_menu_pulpit_redakcja.txt");

  const targetFile = customFilePath || (fs.existsSync(jsonDefault) ? jsonDefault : null);

  if (targetFile && targetFile.endsWith(".json") && fs.existsSync(targetFile)) {
    sourceFormat = "JSON";
    const raw = fs.readFileSync(targetFile, "utf-8");
    const parsed = JSON.parse(raw);
    const items = parsed.items || (Array.isArray(parsed) ? parsed : []);
    entries = items.map((item) => ({
      id: item.id,
      text: item.plainLanguage || item.text || item.original,
      original: item.original,
      context: item.context,
    }));
  } else if (targetFile && targetFile.endsWith(".csv") && fs.existsSync(targetFile)) {
    sourceFormat = "CSV";
    const raw = fs.readFileSync(targetFile, "utf-8").replace(/^\uFEFF/, "");
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const header = lines[0].split(";");
    const idIdx = 0;
    const plainIdx = 5;

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(";").map((col) => col.replace(/^"|"$/g, "").replace(/""/g, '"'));
      if (cols[idIdx]) {
        entries.push({
          id: cols[idIdx],
          text: cols[plainIdx] || cols[4],
          original: cols[4],
          context: cols[2],
        });
      }
    }
  } else if (targetFile && targetFile.endsWith(".txt") && fs.existsSync(targetFile)) {
    sourceFormat = "TXT";
    const raw = fs.readFileSync(targetFile, "utf-8");
    const blocks = raw.split(/--------------------------------------------------------------------------------/);
    
    for (const block of blocks) {
      const idMatch = block.match(/ID:\s*([^\r\n]+)/);
      const plainMatch = block.match(/PROSTY JĘZYK \(PO REDAKCJI\):\r?\n([\s\S]*?)(?=\r?\n\r?\nWskazówka|$)/);
      const origMatch = block.match(/ORYGINALNY TEKST:\r?\n([\s\S]*?)(?=\r?\n\r?\nPROSTY JĘZYK|$)/);

      if (idMatch) {
        entries.push({
          id: idMatch[1].trim(),
          text: plainMatch ? plainMatch[1].trim() : (origMatch ? origMatch[1].trim() : ""),
          original: origMatch ? origMatch[1].trim() : "",
        });
      }
    }
  } else {
    throw new Error(`Nie odnaleziono pliku źródłowego do importu. Oczekiwano .json, .csv lub .txt w katalogu exports/`);
  }

  // Budowanie słownika klucz -> wartość
  const dictionary = {};
  for (const entry of entries) {
    if (entry.id) {
      dictionary[entry.id] = entry.text;
    }
  }

  // Zapis do src/locales/plainLanguage.json
  const outJsonPath = path.join(localesDir, "plainLanguage.json");
  fs.writeFileSync(outJsonPath, JSON.stringify(dictionary, null, 2), "utf-8");

  // Zapis do modułu TypeScript src/locales/plainLanguage.ts dla wygody w kodzie
  const outTsPath = path.join(localesDir, "plainLanguage.ts");
  const tsContent = `// Automatycznie wygenerowany słownik prostego języka
// Wygenerowano: ${new Date().toISOString()}
// Źródło: ${sourceFormat} (${entries.length} fraz)

export const plainLanguageDictionary: Record<string, string> = ${JSON.stringify(dictionary, null, 2)};

export function t(key: string, fallback?: string): string {
  return plainLanguageDictionary[key] || fallback || key;
}
`;
  fs.writeFileSync(outTsPath, tsContent, "utf-8");

  console.log(`=======================================================`);
  console.log(`SUKCES: Zaimportowano ${entries.length} fraz z formatu ${sourceFormat}!`);
  console.log(`Zapisano słownik JSON: ${outJsonPath}`);
  console.log(`Zapisano moduł TypeScript: ${outTsPath}`);
  console.log(`=======================================================`);

  return { total: entries.length, outJsonPath, outTsPath };
}

// Obsługa uruchomienia z wiersza poleceń: node scripts/import_plain_language.js [ścieżka_do_pliku]
if (process.argv[1] && process.argv[1].endsWith("import_plain_language.js")) {
  const customFile = process.argv[2] ? path.resolve(process.argv[2]) : null;
  try {
    importPlainLanguage(customFile);
  } catch (err) {
    console.error("Błąd podczas importu:", err.message);
    process.exit(1);
  }
}
