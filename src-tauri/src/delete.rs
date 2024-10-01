use std::sync::Mutex;

use log::debug;
use tauri::{AppHandle, Emitter, Runtime, State};

use crate::history::ClipboardHistory;

#[tauri::command]
pub async fn delete<R: Runtime>(
    app: AppHandle<R>,
    state: State<'_, Mutex<ClipboardHistory>>,
    item: usize,
) -> Result<(), String> {
    let mut history = state.lock().unwrap();
    let old_size = history.len();
    history.delete(item);
    app.emit("history-updated", {}).unwrap();

    debug!(
        "delete({}) invoked, size was: {}, now: {}",
        item,
        old_size,
        history.len()
    );

    Ok(())
}
