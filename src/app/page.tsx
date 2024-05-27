import { AI } from "@/lib/free-chat/actions";
import { Chat } from "./fragments/chat";

export default function Home() {
  return (
    <AI>
      <Chat />
    </AI>
  );
}
