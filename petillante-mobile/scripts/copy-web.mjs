// Copie l'app web (../petillante) dans www/, le dossier que Capacitor embarque.
// Une seule source de vérité : on modifie ../petillante, jamais www/.
import { cpSync, rmSync, mkdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "..", "..", "petillante");
const out = join(here, "..", "www");
const skip = new Set(["README.md", "sw.js", "manifest.webmanifest", "og.png"]);

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(src, out, { recursive: true, filter: p => !skip.has(basename(p)) });
console.log("www/ prêt depuis", src);
