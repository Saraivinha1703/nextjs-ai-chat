import { AI } from "../../lib/chat/actions";
import { GenerativeUIChat } from "./fragments/generative-ui-chat";

export default function GenerativeUIPage() {
  return (
    <AI>
      <GenerativeUIChat />
    </AI>
  );
}
