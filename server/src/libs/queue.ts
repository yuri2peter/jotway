type QueueTask = () => Promise<void>;

export default class Queue {
  _tasks: QueueTask[] = [];
  _running = false;
  push(task: QueueTask) {
    this._tasks.push(task);
    this._run();
  }
  async _run() {
    if (this._running || this._tasks.length === 0) {
      return;
    }
    const task = this._tasks.shift() as QueueTask;
    this._running = true;
    task()
      .catch(() => {})
      .finally(() => {
        this._running = false;
        this._run();
      });
  }
}
