use log::debug;
use tauri::Runtime;

mod shortcut;
mod tray;

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn paste<R: Runtime>(_app: tauri::AppHandle<R>, item: usize) -> Result<(), String> {
    debug!("paste item: `{item}`");
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, paste])
        .setup(|app| {
            app.set_activation_policy(tauri::ActivationPolicy::Accessory);

            tray::create_tray(&app.handle())?;
            shortcut::create_shortcut(&app.handle())?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
