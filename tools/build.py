"""
Сборка CRM для сервера: в папку dist/ попадают только файлы сайта (без Excel, видео и скриптов).

Запуск:
    python3 tools/build.py                 # данные хранятся в браузере
    python3 tools/build.py --api /api      # данные на сервере, протокол в API.md
    python3 tools/build.py --api /api --no-seed   # без js/data.js (когда данные уже на сервере)

Ссылки на css/js получают ?v=<хеш>, поэтому после обновления браузеры не берут старые файлы из кеша.
"""
import argparse
import hashlib
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FILES = ["css/style.css", "js/config.js", "js/data.js", "js/app.js"]


def main():
    ap = argparse.ArgumentParser(description="Сборка CRM в dist/")
    ap.add_argument("--out", default=str(ROOT / "dist"), help="куда собрать (по умолчанию dist/)")
    ap.add_argument("--api", help="адрес API сервера, например /api; без него — как в js/config.js")
    ap.add_argument("--login-url", help="страница входа на сервере")
    ap.add_argument("--no-seed", action="store_true",
                    help="не класть js/data.js: начальные данные из Excel не нужны, если база уже на сервере")
    args = ap.parse_args()

    out = Path(args.out).resolve()
    if out == ROOT or out in ROOT.parents or (out.exists() and any(out.glob("*.xlsx"))):
        raise SystemExit(f"{out} — не папка сборки, удалять её нельзя")
    if out.exists():
        shutil.rmtree(out)
    files = [f for f in FILES if not (args.no_seed and f == "js/data.js")]
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    if args.no_seed:
        html = re.sub(r'\s*<script src="js/data\.js"></script>', "", html)

    for f in files:
        dst = out / f
        dst.parent.mkdir(parents=True, exist_ok=True)
        if f == "js/config.js" and (args.api is not None or args.login_url is not None):
            text = (ROOT / f).read_text(encoding="utf-8")
            if args.api is not None:
                text = re.sub(r'api:\s*"[^"]*"', f"api: {json.dumps(args.api)}", text)
            if args.login_url is not None:
                text = re.sub(r'loginUrl:\s*"[^"]*"', f"loginUrl: {json.dumps(args.login_url)}", text)
            dst.write_text(text, encoding="utf-8")
        else:
            shutil.copy2(ROOT / f, dst)
        v = hashlib.sha256(dst.read_bytes()).hexdigest()[:10]
        html, n = re.subn(rf'(["\']){re.escape(f)}\1', rf"\g<1>{f}?v={v}\g<1>", html)
        if not n:
            raise SystemExit(f"в index.html нет ссылки на {f}")

    (out / "index.html").write_text(html, encoding="utf-8")
    config = (out / "js/config.js").read_text(encoding="utf-8")
    api = re.search(r'api:\s*"([^"]*)"', config).group(1)
    size = sum(p.stat().st_size for p in out.rglob("*") if p.is_file())
    print(f"Собрано в {out} ({size / 1024:.0f} КБ)")
    print(f"  хранение: {'сервер ' + api if api else 'браузер (api пустой)'}")
    print(f"  начальные данные из Excel: {'нет' if args.no_seed else 'да (js/data.js)'}")
    if api and not args.no_seed:
        print("  после первого запуска, когда данные попали на сервер, соберите с --no-seed:"
              " иначе js/data.js с данными клиентов открыт любому по ссылке")


if __name__ == "__main__":
    main()
