import { useState } from "react"
import { ChainId, DAppProvider, Kovan, Rinkeby } from "@usedapp/core"
import { Header } from "./components/Header"
import { Container } from "@material-ui/core"
import { Main } from "./components/Main"

function App() {
  const [count, setCount] = useState(0)

  return (
    <DAppProvider
      // config={{
      //   supportedChains: [ChainId.Kovan, ChainId.Rinkeby, 1337],
      // }}
      config={{
        networks: [Kovan],
        readOnlyUrls: {
          [ChainId.Kovan]:
            "https://kovan.infura.io/v3/e7fc41d21edc4fc286aa33b44e2d77c7",
        },
        notifications: {
          expirationPeriod: 10000,
          checkInterval: 10000,
        },
      }}
    >
      <Header />
      <Container maxWidth='md'>
        <Main />
      </Container>
    </DAppProvider>
  )
}

export default App
