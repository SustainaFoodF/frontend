import { useEffect, useState } from "react";
import { getCommandByUser } from "../../services/commandeService";
import "./index.css";
import CommandClientView from "./commandClientView";
import CommandBusinessView from "./commandBusinessView";
export default function CommandPage() {
  const [data, sethata] = useState([]);
  const [loading, setLoading] = useState(false);
  const userRole = localStorage.getItem("userRole");
  console.log(userRole);
  const fetchCommands = async () => {
    setLoading(true);
    const commands = await getCommandByUser();
    if (commands) {
      sethata(commands);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchCommands();
  }, []);
  if (loading) {
    return <>...</>;
  } else if (userRole === "client") {
    return <CommandClientView data={data} />;
  } else if (userRole === "business") {
    return <CommandBusinessView data={data} />;
  }
}
