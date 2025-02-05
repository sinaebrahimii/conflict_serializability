import "./App.css";
import ScheduleList from "./components/ScheduleList";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import DialogForm from "./components/DialogForm";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScheduleList />
      <DialogForm />
    </QueryClientProvider>
  );
}

export default App;
