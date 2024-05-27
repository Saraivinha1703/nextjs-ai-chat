import { AI } from "@/lib/rag-chat/actions";
import { RAGChat } from "./fragments/rag-chat";

export default function RAGChatPage() {
  return (
    <AI>
      <RAGChat />
    </AI>
  );
}
