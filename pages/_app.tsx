import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider } from "next-themes";
import { ChakraProvider } from "@chakra-ui/react";
import { MetaplexProvider } from "./MetaplexProvider";
import { WalletContextProvider } from "./WalletContextProvider";


export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider>
        <ThemeProvider attribute="class">
          <WalletContextProvider>
            <MetaplexProvider>
              <Component {...pageProps} />
            </MetaplexProvider>
          </WalletContextProvider>
        </ThemeProvider>
      </ChakraProvider>
    </>
  );
}
