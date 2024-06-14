import React, { useEffect, useState } from "react";
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  FormHelperText,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";

import { FaUserAlt, FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatState } from "../Context/ChatProvider";
import { server } from "../config/Server";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");
  const { setUser } = ChatState();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    // console.log(userInfo);
    if (userInfo) {
      navigate("/chat");
    }
    
    // setUser(userInfo)
  }, [setUser,navigate]);

  const handleShowClick = () => setShowPassword(!showPassword);

  const toast = useToast();

  const handleSubmit = async () => {
    setLoading(true);
    if (!password || !email) {
      toast({
        title: "Please enter all fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      let { data } = await axios.post(
        `${server}/api/user/login`,
        {
          email,
          password,
        },
        config
      );
      data = await data.data;
      // console.log(data);
      toast({
        title: "Login Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      setUser(userInfo);

      setLoading(false);

      navigate("/chat");
    } catch (error) {
      // console.log(error);
      toast({
        title: error.response.data.message,
        // description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <div className="bg">
      <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        // backgroundColor="gray.200"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          flexDir="column"
          mb="2"
          justifyContent="center"
          alignItems="center"
        >
          <Box minW={{ base: "90%", md: "468px" }}>
            <form>
              <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
              >
                <Heading textAlign="center">Login</Heading>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      type="email"
                      placeholder="Email address"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<CFaLock color="gray.300" />}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                      <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  <FormHelperText textAlign="right">
                    <Link href="/forgetpassword">forgot password?</Link>
                  </FormHelperText>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
                  width="full"
                  isLoading={loading}
                  onClick={handleSubmit}
                >
                  Login
                </Button>
                <Flex justifyContent="flex-end">
                  <Box>
                    New User?{" "}
                    <Link color="teal.500" href="/">
                      Sign Up
                    </Link>
                  </Box>
                </Flex>
              </Stack>
            </form>
          </Box>
        </Stack>
      </Flex>
    </div>
  );
}

export default Login;
