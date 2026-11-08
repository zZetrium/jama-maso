let server = "";
async function init() {
    server = window.prompt("server") ?? "";

}

async function perform(action:string) {
    await fetch(`${server}?${action}`, {
          method: "POST"
    });
}
(window as any).perform = perform;
init();