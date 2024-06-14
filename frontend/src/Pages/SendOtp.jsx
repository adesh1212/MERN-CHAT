import {
  Box,
  Button,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  Toast,
  chakra,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "../config/Server";

const CFaUserAlt = chakra(FaUserAlt);

function SendOtp() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      navigate("/chat");
    }
    // setUser(userInfo);
  }, [navigate]);

  const sendOtp = async () => {
    if (!email) {
      toast({
        title: "Please enter the email",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${server}/api/user/forgetpassword`,
        {
          email,
        },
        config
      );

      const msg = await data.msg;
      // console.log(data);
      toast({
        title: msg,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      navigate("/login");
    } catch (error) {
      const err = await error.response.data.msg;
      setLoading(false);
      toast({
        title: err,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  return (
    <Flex
      width="100wh"
      height="100vh"
      // backgroundColor="gray.200"
      justifyContent="center"
    >
      <Box
        display="flex"
        flexDir="column"
        w={{ base: "90%", md: "468px" }}
        alignItems="center"
        mt="2rem"
      >
        <form>
          <Stack
            spacing={6}
            p="2rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <Text>
              Enter the Email address associated with your account and we'll
              send you a link to reset the password
            </Text>
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
            <Button colorScheme="blue" onClick={sendOtp} isLoading={loading}>
              Continue
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
}

export default SendOtp;
