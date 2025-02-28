import {
  Box,
  Container,
  Heading,
  HStack,
  Img,
  Text,
  useColorMode,
  VStack,
} from "@chakra-ui/react"
import { useThemeContext } from "components/[guild]/ThemeContext"
import useIsomorphicLayoutEffect from "hooks/useIsomorphicLayoutEffect"
import Head from "next/head"
import Image from "next/image"
import { useRouter } from "next/router"
import { ArrowLeft } from "phosphor-react"
import { PropsWithChildren, ReactNode, useRef, useState } from "react"
import parseDescription from "utils/parseDescription"
import Button from "../Button"
import Footer from "./components/Footer"
import Header from "./components/Header"

type Props = {
  image?: JSX.Element
  title: string
  description?: string
  showLayoutDescription?: boolean
  textColor?: string
  action?: ReactNode | undefined
  background?: string
  backgroundImage?: string
  backgroundOffset?: number
  showBackButton?: boolean
  showhat?: boolean
}

const Layout = ({
  image,
  title,
  description,
  showLayoutDescription,
  textColor,
  action,
  background,
  backgroundImage,
  backgroundOffset = 128,
  showBackButton,
  children,
  showhat,
}: PropsWithChildren<Props>): JSX.Element => {
  const childrenWrapper = useRef(null)
  const [bgHeight, setBgHeight] = useState("0")

  const router: any = useRouter()
  const hasNavigated = router.components && Object.keys(router.components).length > 2
  const colorContext = useThemeContext()

  useIsomorphicLayoutEffect(() => {
    if ((!background && !backgroundImage) || !childrenWrapper?.current) return

    const rect = childrenWrapper.current.getBoundingClientRect()
    setBgHeight(`${rect.top + (window?.scrollY ?? 0) + backgroundOffset}px`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, description, childrenWrapper?.current, action])

  const { colorMode } = useColorMode()

  return (
    <>
      <Head>
        <title>{`${title}`}</title>
        <meta property="og:title" content={`${title}`} />
        {description && (
          <>
            <meta name="description" content={description} />
            <meta property="og:description" content={description} />
          </>
        )}
      </Head>
      <Box
        id="background"
        position="relative"
        bgColor={colorMode === "light" ? "gray.100" : "gray.800"}
        bgGradient={
          !background &&
          `linear(${
            colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
          } 0px, var(--chakra-colors-gray-100) 700px)`
        }
        bgBlendMode={colorMode === "light" ? "normal" : "color"}
        minHeight="100vh"
        display="flex"
        flexDir={"column"}
        // temporary
        sx={{ "> *": { zIndex: 1 } }}
      >
        {(background || backgroundImage) && (
          <Box
            position="absolute"
            top={0}
            left={0}
            w="full"
            h={bgHeight}
            background={backgroundImage ? "gray.900" : background}
            opacity={colorMode === "dark" && !backgroundImage ? "0.5" : 1}
          >
            {backgroundImage && (
              <Image
                src={backgroundImage}
                alt="Guild background image"
                layout="fill"
                objectFit="cover"
                priority
                style={{ filter: "brightness(30%)" }}
              />
            )}
          </Box>
        )}
        <Header />
        <Container
          // to be above the absolutely positioned background box
          position="relative"
          maxW="container.lg"
          pt={{ base: 6, md: 9 }}
          pb={24}
          px={{ base: 4, sm: 6, md: 8, lg: 10 }}
        >
          {showBackButton && hasNavigated && (
            <Button
              variant="link"
              color={colorContext.textColor}
              opacity={0.75}
              _active={{}}
              size="sm"
              leftIcon={<ArrowLeft />}
              onClick={() => router.back()}
              alignSelf="flex-start"
              mb="6"
            >
              Go back to explorer
            </Button>
          )}
          <VStack spacing={{ base: 7, md: 10 }} pb={{ base: 9, md: 14 }} w="full">
            <HStack justify="space-between" w="full" spacing={3}>
              <HStack alignItems="center" spacing={{ base: 4, lg: 5 }}>
                {image}
                <Heading
                  as="h1"
                  fontSize={{ base: "3xl", md: "4xl", lg: "5xl" }}
                  fontFamily="display"
                  color={textColor}
                  wordBreak={"break-word"}
                >
                  {showhat && (
                    <Img
                      src="/img/hat.png"
                      w={{ base: "30px", md: "40px", lg: "55px" }}
                      position="absolute"
                      left={{ base: "6px", sm: "14px", md: "18px", lg: "5" }}
                      top={{ base: "18px", md: "6", lg: "5" }}
                      transform="rotate(-30deg)"
                    />
                  )}
                  {title}
                </Heading>
              </HStack>

              {action}
            </HStack>
            {showLayoutDescription && description?.length && (
              <Text
                w="full"
                fontWeight="semibold"
                color={textColor}
                mb="-2 !important"
              >
                {parseDescription(description)}
              </Text>
            )}
          </VStack>
          <Box ref={childrenWrapper}>{children}</Box>
        </Container>

        <Footer />
      </Box>
    </>
  )
}

export default Layout
