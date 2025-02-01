import "./App.css";
import ScheduleList from "./components/ScheduleList";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ScheduleList />
    </QueryClientProvider>
  );
}

export default App;
