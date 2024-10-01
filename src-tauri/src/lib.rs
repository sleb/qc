use std::sync::Mutex;

use history::ClipboardHistory;
use tauri::Manager;

mod delete;
mod history;
mod paste;
mod shortcut;
mod tray;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            paste::paste,
            history::history,
            delete::delete,
        ])
        .setup(|app| {
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            tray::create_tray(&app.handle())?;
            shortcut::create_shortcut(&app.handle())?;

            app.manage(Mutex::new(ClipboardHistory::default()));
            history::start_clipboard_monitor(app.handle());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
