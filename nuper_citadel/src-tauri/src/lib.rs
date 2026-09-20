use std::process::{Child, Command};
use std::sync::Mutex;
use tauri::{
    menu::{Menu, MenuItem},
    tray::{TrayIconBuilder, TrayIconEvent},
    AppHandle, Manager,
};

// Arka planda çalışan Python FastAPI sunucu sürecini saklayan global referans
static PYTHON_PROCESS: Mutex<Option<Child>> = Mutex::new(None);

/// Yerel Python FastAPI çekirdeğini (127.0.0.1:8765) başlatır
fn start_python_backend() {
    let python_cmd = if cfg!(target_os = "windows") {
        let venv_python = std::path::Path::new(".venv\\Scripts\\python.exe");
        if venv_python.exists() {
            ".venv\\Scripts\\python.exe".to_string()
        } else {
            "python".to_string()
        }
    } else {
        "python3".to_string()
    };

    println!("[Tauri] Yerel Python motoru başlatılıyor: {}", python_cmd);

    let child = Command::new(&python_cmd)
        .args(&["-m", "uvicorn", "engine.main:app", "--host", "127.0.0.1", "--port", "8765"])
        .spawn();

    match child {
        Ok(proc) => {
            println!("[Tauri] Python FastAPI çekirdeği PID: {} ile başlatıldı.", proc.id());
            let mut lock = PYTHON_PROCESS.lock().unwrap();
            *lock = Some(proc);
        }
        Err(e) => {
            eprintln!("[Tauri Hata] Python motoru başlatılamadı: {}", e);
        }
    }
}

/// Uygulama kapanırken arkada yetim (zombie) Python süreci kalmasını önler
fn stop_python_backend() {
    let mut lock = PYTHON_PROCESS.lock().unwrap();
    if let Some(mut child) = lock.take() {
        println!("[Tauri] Python çekirdek süreci (PID: {}) güvenle sonlandırılıyor...", child.id());
        let _ = child.kill();
        let _ = child.wait();
        println!("[Tauri] Python süreci kapatıldı.");
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Uygulama başlarken Python FastAPI sunucusunu ayağa kaldır
    start_python_backend();

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            let app_handle = app.handle().clone();

            // Sistem Tepsisi (Tray Icon) Menüsü
            let show_item = MenuItem::with_id(app, "show", "Ön Plana Getir / Göster", true, None::<&str>)?;
            let status_item = MenuItem::with_id(app, "status", "Yerel Motor: 127.0.0.1:8765 (Aktif)", false, None::<&str>)?;
            let quit_item = MenuItem::with_id(app, "quit", "Çıkış", true, None::<&str>)?;

            let tray_menu = Menu::with_items(app, &[&show_item, &status_item, &quit_item])?;

            let _tray = TrayIconBuilder::new()
                .menu(&tray_menu)
                .tooltip("Nuper Citadel Air-Gapped Savunma İstasyonu")
                .on_menu_event(move |_app, event| match event.id.as_ref() {
                    "show" => {
                        if let Some(window) = app_handle.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                    "quit" => {
                        stop_python_backend();
                        std::process::exit(0);
                    }
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click { .. } = event {
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            let _ = window.show();
                            let _ = window.set_focus();
                        }
                    }
                })
                .build(app)?;

            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::Destroyed = event {
                // Ana pencere kapandığında motoru temizle
                if window.label() == "main" {
                    stop_python_backend();
                }
            }
        })
        .run(tauri::generate_context!())
        .expect("Tauri uygulaması başlatılırken hata oluştu");
}
