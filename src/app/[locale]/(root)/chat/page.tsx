import ChattingRoom from "components/sn-chatting-room";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
  };
}

export default function Page() {
  return <ChattingRoom />;
}
