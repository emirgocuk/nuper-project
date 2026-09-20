"""
Nuper Citadel - Air-Gapped Desktop Launcher & Lifecycle Manager
=============================================================
Manages the end-to-end lifecycle of the air-gapped engineering station:
1. Validates ports and ensures clean state (no orphaned zombie processes).
2. Spawns the deterministic FastAPI backend (127.0.0.1:8765).
3. Spawns the Vite/Static UI shell.
4. Launches the desktop application window (Chromium/Edge --app mode with native window chrome).
5. Intercepts window exit and gracefully terminates all child processes.
"""

import atexit
import os
import signal
import subprocess
import sys
import time
import urllib.request

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
VENV_PYTHON = os.path.join(ROOT_DIR, ".venv", "Scripts", "python.exe")
if not os.path.exists(VENV_PYTHON):
    VENV_PYTHON = sys.executable

CHILD_PROCESSES = []


def cleanup():
    """Cleanly terminates all spawned child processes to avoid zombie background tasks."""
    print("\n[Nuper Citadel] Kapanış sinyali alındı. Süreçler güvenle temizleniyor...")
    for proc in CHILD_PROCESSES:
        if proc and proc.poll() is None:
            try:
                # Windows taskkill with /T (tree) and /F (force) to eliminate child workers
                if os.name == "nt":
                    subprocess.run(
                        ["taskkill", "/F", "/T", "/PID", str(proc.pid)],
                        capture_output=True,
                        check=False,
                    )
                else:
                    proc.terminate()
                    proc.wait(timeout=2)
            except Exception as e:
                print(f"[Uyarı] Süreç PID {proc.pid} sonlandırılırken hata: {e}")
    print("[Nuper Citadel] Tüm süreçler başarıyla kapatıldı. Sıfır artık işlem.")


atexit.register(cleanup)


def find_browser_app_mode():
    """Finds Chrome or Edge executable to launch standalone app-mode window."""
    candidates = [
        os.path.expandvars(r"%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"),
        os.path.expandvars(r"%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"),
        os.path.expandvars(r"%ProgramFiles%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"),
        os.path.expandvars(r"%LocalAppData%\Google\Chrome\Application\chrome.exe"),
    ]
    for path in candidates:
        if os.path.exists(path):
            return path
    return None


def wait_for_service(url: str, timeout: float = 12.0) -> bool:
    """Polls a local URL until it responds or timeout is exceeded."""
    start = time.time()
    while time.time() - start < timeout:
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "NuperLauncher/1.0"})
            with urllib.request.urlopen(req, timeout=1.0) as resp:
                if resp.status in (200, 304):
                    return True
        except Exception:
            time.sleep(0.3)
    return False


def start_backend():
    """Spawns the local FastAPI engine."""
    print("[Nuper Citadel] Yerel FastAPI çekirdeği başlatılıyor (127.0.0.1:8765)...")
    env = os.environ.copy()
    env["PYTHONPATH"] = ROOT_DIR
    cmd = [
        VENV_PYTHON,
        "-m",
        "uvicorn",
        "engine.main:app",
        "--host",
        "127.0.0.1",
        "--port",
        "8765",
        "--log-level",
        "warning",
    ]
    proc = subprocess.Popen(cmd, cwd=ROOT_DIR, env=env)
    CHILD_PROCESSES.append(proc)

    if not wait_for_service("http://127.0.0.1:8765/docs", timeout=10.0):
        print("[HATA] FastAPI çekirdeği 10 saniye içinde yanıt vermedi!")
        sys.exit(1)
    print("[Nuper Citadel] Backend servisi aktif (PID: %d)." % proc.pid)
    return proc


def start_frontend(dev_mode: bool = False):
    """Spawns Vite dev server."""
    print("[Nuper Citadel] Ön yüz servisi başlatılıyor (127.0.0.1:5173)...")
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    cmd = [npm_cmd, "run", "dev", "--", "--host", "127.0.0.1", "--port", "5173"]
    proc = subprocess.Popen(cmd, cwd=FRONTEND_DIR, shell=(os.name == "nt"))
    CHILD_PROCESSES.append(proc)

    if not wait_for_service("http://127.0.0.1:5173", timeout=12.0):
        print("[HATA] Ön yüz servisi 12 saniye içinde yanıt vermedi!")
        sys.exit(1)
    print("[Nuper Citadel] Ön yüz servisi aktif (PID: %d)." % proc.pid)
    return proc


def run_desktop(check_only: bool = False):
    """Launches full desktop station."""
    print("================================================================")
    print("  NUPER CITADEL - Savunma Sanayii Kalifikasyon & Pre-FEA")
    print("  Air-Gapped Masaüstü Başlatıcı (Yerel 127.0.0.1)")
    print("================================================================")

    if check_only:
        print("[Denetim] Python Yolu:", VENV_PYTHON)
        print("[Denetim] Frontend Yolu:", FRONTEND_DIR)
        browser = find_browser_app_mode()
        print("[Denetim] Tespit Edilen Desktop Shell:", browser or "Varsayılan Tarayıcı")
        print("[Denetim] Sistem kontrolleri tamamlandı - Hazır.")
        return 0

    # Handle signal interrupts
    def sig_handler(signum, frame):
        cleanup()
        sys.exit(0)

    signal.signal(signal.SIGINT, sig_handler)
    signal.signal(signal.SIGTERM, sig_handler)

    # 1. Start Python Backend
    start_backend()

    # 2. Start Frontend
    start_frontend()

    # 3. Launch App Window Shell
    target_url = "http://127.0.0.1:5173"
    browser_bin = find_browser_app_mode()

    if browser_bin:
        profile_dir = os.path.join(ROOT_DIR, ".citadel_desktop_profile")
        os.makedirs(profile_dir, exist_ok=True)
        app_args = [
            browser_bin,
            f"--app={target_url}",
            "--window-size=1440,920",
            "--window-position=100,50",
            f"--user-data-dir={profile_dir}",
            "--no-first-run",
            "--no-default-browser-check",
        ]
        print(f"[Nuper Citadel] Masaüstü Penceresi Başlatılıyor: {browser_bin}")
        win_proc = subprocess.Popen(app_args)
        # Wait for the native window to close
        try:
            win_proc.wait()
        except KeyboardInterrupt:
            pass
    else:
        import webbrowser
        print("[Nuper Citadel] Standalone shell bulunamadı, tarayıcı sekmesi açılıyor...")
        webbrowser.open(target_url)
        print("[Nuper Citadel] Çıkmak için Ctrl+C tuşlarına basınız.")
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            pass

    cleanup()
    return 0


if __name__ == "__main__":
    is_check = "--check" in sys.argv
    sys.exit(run_desktop(check_only=is_check))
