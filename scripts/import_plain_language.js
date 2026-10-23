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
 * Parsowanie pojedynczego pliku zredagowanych fraz (TXT, JSON lub CSV)
 */
function parseFile(filePath) {
  const entries = [];
  let sourceFormat = "";

  if (filePath.endsWith(".json")) {
    sourceFormat = "JSON";
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    const items = parsed.items || (Array.isArray(parsed) ? parsed : []);
    for (const item of items) {
      if (item.id) {
        entries.push({
          id: item.id,
          text: item.plainLanguage || item.text || item.original,
          original: item.original,
          context: item.context,
        });
      }
    }
  } else if (filePath.endsWith(".csv")) {
    sourceFormat = "CSV";
    const raw = fs.readFileSync(filePath, "utf-8").replace(/^\uFEFF/, "");
    const lines = raw.split(/\r?\n/).filter(Boolean);
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
  } else if (filePath.endsWith(".txt")) {
    sourceFormat = "TXT";
    const raw = fs.readFileSync(filePath, "utf-8");
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
  }

  return { entries, sourceFormat };
}

/**
 * Narzędzie do importu zredagowanych fraz prostego języka.
 * Obsługuje:
 *  - Pojedynczy plik .txt, .json lub .csv (np. exports/frazy_logowanie_redakcja.txt)
 *  - Domyślnie: import i scalenie wszystkich plików z katalogu exports/
 */
export function importPlainLanguage(customFilePath = null) {
  const dictionary = {};
  let totalImported = 0;
  const processedFiles = [];

  if (customFilePath) {
    const resolvedPath = path.resolve(customFilePath);
    if (!fs.existsSync(resolvedPath)) {
      throw new Error(`Plik nie istnieje: ${resolvedPath}`);
    }
    const { entries, sourceFormat } = parseFile(resolvedPath);
    for (const entry of entries) {
      if (entry.id) {
        dictionary[entry.id] = entry.text;
      }
    }
    totalImported = entries.length;
    processedFiles.push(`${path.basename(resolvedPath)} (${sourceFormat})`);
  } else {
    // Automatyczne scalenie wszystkich plików redakcyjnych z katalogu exports/
    const targetTxtFiles = [
      "frazy_pulpit_redakcja.txt",
      "frazy_logowanie_redakcja.txt",
      "frazy_audyty_redakcja.txt",
      "frazy_menu_pulpit_redakcja.txt",
    ];

    for (const fileName of targetTxtFiles) {
      const fullPath = path.join(exportsDir, fileName);
      if (fs.existsSync(fullPath)) {
        const { entries } = parseFile(fullPath);
        for (const entry of entries) {
          if (entry.id) {
            dictionary[entry.id] = entry.text;
          }
        }
        processedFiles.push(`${fileName} (${entries.length} fraz)`);
      }
    }

    totalImported = Object.keys(dictionary).length;
  }

  // Zapis do src/locales/plainLanguage.json
  const outJsonPath = path.join(localesDir, "plainLanguage.json");
  fs.writeFileSync(outJsonPath, JSON.stringify(dictionary, null, 2), "utf-8");

  // Zapis do modułu TypeScript src/locales/plainLanguage.ts dla wygody w kodzie
  const outTsPath = path.join(localesDir, "plainLanguage.ts");
  const tsContent = `// Automatycznie wygenerowany słownik prostego języka (W-ally)
// Wygenerowano: ${new Date().toISOString()}
// Przetworzone pliki: ${processedFiles.join(", ")}
// Łączna liczba unikalnych fraz: ${Object.keys(dictionary).length}

export const plainLanguageDictionary: Record<string, string> = ${JSON.stringify(dictionary, null, 2)};

/**
 * Funkcja pobierająca zredagowaną frazę prostego języka według unikalnego klucza ID.
 * Jeśli klucz nie został podmieniony, zwraca oryginalny tekst (fallback).
 */
export function t(key: string, fallback?: string): string {
  return plainLanguageDictionary[key] || fallback || key;
}
`;
  fs.writeFileSync(outTsPath, tsContent, "utf-8");

  console.log(`================================================================================`);
  console.log(`SUKCES: Zaimportowano i zaktualizowano słownik prostego języka!`);
  console.log(`  - Przetworzone źródła: ${processedFiles.join(", ")}`);
  console.log(`  - Łączna liczba fraz w słowniku: ${Object.keys(dictionary).length}`);
  console.log(`  - Zapisano JSON: ${outJsonPath}`);
  console.log(`  - Zapisano TS:   ${outTsPath}`);
  console.log(`================================================================================`);

  return { total: Object.keys(dictionary).length, outJsonPath, outTsPath };
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
