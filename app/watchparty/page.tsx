"use client";

import { Button, Input } from "@nextui-org/react";
import { useEffect, useRef, useState } from "react";
import { FiCheck, FiCopy } from "react-icons/fi";
import ReactPlayer from "react-player";
import { useAppContext } from "../context";
import { useSearchParams } from "next/navigation";
import PeerJS, { Peer } from "peerjs";

export default function WatchParty() {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [peerId, setPeerId] = useState<string>("");
  const [copyToggle, setCopyToggle] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const peer = useRef<Peer | null>(null);

  const remotePeerId = searchParams.get("peer");

  const { videoUrlOrPeerId } = useAppContext();

  useEffect(() => {
    const initiatePeer = async () => {
      import("peerjs").then(({ default: Peer }) => {
        peer.current = new Peer({});

        peer.current.on("open", (id) => {
          setPeerId(id);
        });

        peer.current.on("error", (error) => {
          console.log(error);
        });

        if (remotePeerId) {
          setupClientConnection();
          return;
        }

        peer.current.on("connection", (conn) => {
          conn.on("data", (data) => {
            // Will print 'hi!'
            console.log(data);
          });
          conn.on("open", () => {
            console.log("client connected");
            conn.send("hello!");
          });
        });
      });
    };
    initiatePeer();
  }, []);

  const seekVideo = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(99.1, "seconds");
      setPlaying(true);
    }
  };

  const copyPeerId = () => {
    navigator.clipboard.writeText(peerId);
    setCopyToggle(true);
    setTimeout(() => {
      setCopyToggle(false);
    }, 1000);
  };

  const setupClientConnection = () => {
    if (!remotePeerId) {
      return;
    }

    const connection = peer.current?.connect(remotePeerId);
    connection?.on("data", (data) => {
      console.log("Venho do futuro", data);
    });

    connection?.on("open", () => {
      connection.send("hi!");
    });
  };

  return (
    <main className="container mx-auto">
      <div className="pt-10 flex justify-center items-center flex-col">
        {/* <ReactPlayer
          ref={playerRef}
          style={{ minHeight: "60vh" }}
          width={"100%"}
          playing={playing}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          //url={"https://www.youtube.com/watch?v=bmAwpcTyKyo"}
          url={videoUrlOrPeerId}
          controls
          progressInterval={1000}
          onProgress={(state) => {
            console.log(state);
          }}
        /> */}
        {/* <Button color="primary" variant="shadow" size="lg" onClick={seekVideo}>
          Teste seek
        </Button> */}

        <div className="mt-10 flex">
          {!remotePeerId && (
            <Input
              label="PeerID"
              disabled
              value={peerId}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={copyPeerId}
                >
                  {copyToggle ? (
                    <FiCheck className="text-green-500" />
                  ) : (
                    <FiCopy />
                  )}
                </button>
              }
              className="max-w-xs"
            />
          )}
          <Button
            color="primary"
            variant="shadow"
            size="lg"
            onClick={setupClientConnection}
          >
            Connect
          </Button>
        </div>
      </div>
    </main>
  );
}
