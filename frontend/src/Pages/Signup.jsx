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
  InputRightElement,
  FormLabel,
  useToast,
} from "@chakra-ui/react";

import { FaUserAlt, FaLock } from "react-icons/fa";
import { CiFileOn } from "react-icons/ci";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../Context/ChatProvider";
import { server } from "../config/Server";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState();
  const [loading, setLoading] = useState(false);
  const { setUser } = ChatState();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chat");
    }
    setUser(userInfo);
  }, [setUser, navigate]);

  const toast = useToast();

  const handleShowClick = () => setShowPassword(!showPassword);


  const postDetails = (pic) => {
    setLoading(true);
    if (pic === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (pic.type === "image/jpeg" || pic.type === "image/png") {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dwna7axtx");

      fetch("https://api.cloudinary.com/v1_1/dwna7axtx/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log(data);
          setAvatar(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          // console.log(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (!name || !password || !email) {
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
        `${server}/api/user/register`,
        {
          name,
          email,
          password,
          avatar,
        },
        config
      );
      data = await data.data;
      // console.log(data);
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(localStorage.getItem("userInfo"));

      setLoading(false);
      navigate("/chat");
    } catch (error) {
      toast({
        title: error.response.data.message,
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
                <Heading textAlign="center">Sign Up</Heading>
                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      type="text"
                      placeholder="Enter Your Name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </InputGroup>
                </FormControl>

                <FormControl>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input
                      type="email"
                      placeholder="Enter Your Email address"
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
                </FormControl>
                <FormControl>
                  <FormLabel>Upload Avatar</FormLabel>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<CiFileOn color="gray.300" />}
                    />
                    <Input
                      type="file"
                      py={1.5}
                      accept="image/*"
                      onChange={(e) => postDetails(e.target.files[0])}
                    />
                  </InputGroup>
                </FormControl>
                <Button
                  borderRadius={0}
                  type="submit"
                  variant="solid"
                  colorScheme="blue"
                  width="full"
                  onClick={handleSubmit}
                  isLoading={loading}
                >
                  Sign Up
                </Button>
                <Flex justifyContent="flex-end">
                  <Box>
                    Already have an account?{" "}
                    <Link color="teal.500" href="/login">
                      Login
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

export default Signup;
