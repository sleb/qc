use log::debug;
use tauri::Runtime;

#[tauri::command]
pub async fn paste<R: Runtime>(_app: tauri::AppHandle<R>, item: usize) -> Result<(), String> {
    debug!("paste item: {item}");
    Ok(())
}
