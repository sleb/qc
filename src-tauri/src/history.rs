use std::{collections::VecDeque, sync::Mutex, thread};

use clipboard_rs::{
    Clipboard, ClipboardContext, ClipboardHandler, ClipboardWatcher, ClipboardWatcherContext,
    ContentFormat,
};
use log::debug;
use tauri::{AppHandle, Emitter, Manager, Runtime, State};

pub struct ClipboardHistory {
    limit: usize,
    inner: VecDeque<String>,
}

impl Default for ClipboardHistory {
    fn default() -> Self {
        Self {
            limit: 20,
            inner: Default::default(),
        }
    }
}

impl ClipboardHistory {
    pub fn push(&mut self, item: String) {
        if self.inner.len() >= self.limit {
            let last_item = self.inner.pop_back();
            debug!(
                "history size: {} limit: {} dropping: {}",
                self.inner.len(),
                self.limit,
                last_item.expect("history shouldn't be empty since size was >= limit")
            );
        }

        self.inner.push_front(item);
    }

    pub fn delete(&mut self, index: usize) {
        self.inner.remove(index);
    }

    pub fn len(&self) -> usize {
        self.inner.len()
    }
}

struct ClipboardMonitor<R: Runtime> {
    app: AppHandle<R>,
    ctx: ClipboardContext,
}

impl<R: Runtime> ClipboardMonitor<R> {
    fn new(app: AppHandle<R>) -> Self {
        Self {
            app,
            ctx: ClipboardContext::new().unwrap(),
        }
    }
}

impl<R: Runtime> ClipboardHandler for ClipboardMonitor<R> {
    fn on_clipboard_change(&mut self) {
        let history = self.app.state::<Mutex<ClipboardHistory>>();
        let mut history = history.lock().unwrap();

        if self.ctx.has(ContentFormat::Text) {
            history.push(self.ctx.get_text().unwrap());
            debug!("added history item {}", history.inner.len());
            self.app.emit("history-updated", {}).unwrap();
        }
    }
}

pub fn start_clipboard_monitor<R: Runtime>(app: &AppHandle<R>) {
    debug!("creating ClipboardWatcherContext...");
    let mut ctx = ClipboardWatcherContext::new().unwrap();

    debug!("adding new ClipboardMonitor to ClipboardWatcherContext...");
    ctx.add_handler(ClipboardMonitor::new(app.app_handle().clone()));

    thread::spawn(move || {
        debug!("starting watcher...");
        ctx.start_watch();
        debug!("watcher stopping...");
    });
}

#[tauri::command]
pub async fn history(
    state: State<'_, Mutex<ClipboardHistory>>,
) -> Result<VecDeque<String>, String> {
    let items = state.lock().unwrap().inner.clone();
    debug!("history invoked, returning {} items...", items.len());
    Ok(items)
}
