import { render } from "solid-js/web";
import { Button } from "@/components/ui/button";
import "./styles.css";

function App() {
  return <Button variant="outline">Generated button</Button>;
}

render(() => <App />, document.getElementById("root")!);
