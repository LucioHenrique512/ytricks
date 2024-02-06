"use client";
import { Button, Input } from "@nextui-org/react";
import { useAppContext } from "./context";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { videoUrlOrPeerId, setVideoUrlOrPeerId } = useAppContext();
  const [errorMessage, setErrorMessage] = useState<string | null>("");

  const route = useRouter();

  const onSubmit = () => {
    const isValidUrl = (url: string) => {
      // Regular expression to validate URL
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      return urlRegex.test(url);
    };

    if (!isValidUrl(videoUrlOrPeerId)) {
      route.push(`/watchparty?peer=${videoUrlOrPeerId}`);
      return;
    }
    route.push(`/watchparty`);
    console.log("Video URL:", videoUrlOrPeerId);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex justify-center items-center flex-col">
        <h1 className="text-4xl font-bold mb-3">
          Watch<span className="font-light">Party</span>
        </h1>
        <p className="text-2xl mb-5">
          Assita videos com seus amigos em uma watch party
        </p>
        <form
          className="flex flex-col justify-center items-center w-[45vw]"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <Input
            type="text"
            label="Link do video"
            className="mb-5"
            value={videoUrlOrPeerId}
            errorMessage={errorMessage}
            onChange={(e) => {
              if (e.target.value === "") setErrorMessage(null);
              setVideoUrlOrPeerId(e.target.value);
            }}
          />
          <Button color="primary" variant="shadow" size="lg" type="submit">
            Criar sala
          </Button>
        </form>
      </div>
    </main>
  );
}
