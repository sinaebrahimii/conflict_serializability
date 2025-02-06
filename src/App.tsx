import "./App.css";
import TransactionList from "./components/TransactionList";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TransactionList />
    </QueryClientProvider>
  );
}

export default App;
