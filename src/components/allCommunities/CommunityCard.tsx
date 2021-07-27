import {
  Heading,
  Image,
  Portal,
  Stack,
  Tag,
  useColorMode,
  Wrap,
} from "@chakra-ui/react"
import Card from "components/common/Card"
import { Link } from "components/common/Link"
import { useCommunity } from "components/community/Context"
import useColorPalette from "components/community/hooks/useColorPalette"
import useLevelAccess from "components/community/Levels/components/Level/hooks/useLevelAccess"
import React, { MutableRefObject } from "react"

type Props = {
  refAccess: MutableRefObject<HTMLDivElement>
}

const WrappedCard = ({ refAccess }: Props): JSX.Element => {
  const { levels } = useCommunity()
  const [hasAccess] = useLevelAccess(
    levels[0]?.requirementType,
    levels[0]?.requirementAmount
  )

  if (hasAccess)
    return (
      <Portal containerRef={refAccess}>
        <CommunityCard />
      </Portal>
    )

  return <CommunityCard />
}

const CommunityCard = () => {
  const {
    levels,
    urlName,
    imageUrl,
    name: communityName,
    chainData: {
      token: { symbol: tokenSymbol },
    },
    themeColor,
    marketcap,
  } = useCommunity()
  const { colorMode } = useColorMode()

  const generatedColors = useColorPalette("chakra-colors-primary", themeColor)

  const membersCount = levels.reduce(
    (accumulator, currentValue) => accumulator + currentValue.membersCount,
    0
  )

  return (
    <Link
      href={`/${urlName}`}
      _hover={{ textDecor: "none" }}
      borderRadius="2xl"
      w="full"
      sx={generatedColors}
    >
      <Card
        role="group"
        px={{ base: 5, sm: 7 }}
        py="7"
        w="full"
        bgGradient={`linear(to-l, var(--chakra-colors-primary-100), ${
          colorMode === "light" ? "white" : "var(--chakra-colors-gray-800)"
        })`}
        bgBlendMode={colorMode === "light" ? "normal" : "color"}
        bgRepeat="no-repeat"
        bgSize="400%"
        transition="background-size 0.8s ease"
        _hover={{
          bgSize: "100%",
          transition: "background-size 0.24s ease",
        }}
      >
        <Stack
          position="relative"
          direction="row"
          spacing={{ base: 5, sm: 10 }}
          alignItems="center"
        >
          <Image src={`${imageUrl}`} boxSize="45px" alt="Level logo" />
          <Stack spacing="3">
            <Heading size="sm">{communityName}</Heading>
            {levels.length ? (
              <Wrap spacing="2" shouldWrapChildren>
                <Tag colorScheme="alpha">{`${membersCount} members`}</Tag>
                <Tag colorScheme="alpha">{`${levels.length} levels`}</Tag>
                <Tag colorScheme="alpha">
                  {`min: ${levels[0]?.requirementAmount} ${tokenSymbol}`}
                </Tag>
              </Wrap>
            ) : (
              <Wrap shouldWrapChildren>
                <Tag colorScheme="alpha">{`$${marketcap.toLocaleString()} market cap`}</Tag>
              </Wrap>
            )}
          </Stack>
        </Stack>
      </Card>
    </Link>
  )
}

export default WrappedCard
