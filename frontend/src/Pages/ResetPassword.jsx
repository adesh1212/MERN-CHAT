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
import React, { useState } from "react";

import { FaUserAlt } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { server } from "../config/Server";

const CFaUserAlt = chakra(FaUserAlt);

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const navigate = useNavigate();

  const sendOtp = async () => {
    if (!password) {
      toast({
        title: "Please enter the new password",
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
      const { data } = await axios.put(
        `${server}/api/user/resetpassword/${token}`,
        {
          password,
        },
        config
      );

      const msg = await data.msg;
    //   console.log(data);
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
        // console.log(error);
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
        <form style={{ width: "100%" }}>
          <Stack
            spacing={6}
            p="2rem"
            backgroundColor="whiteAlpha.900"
            boxShadow="md"
          >
            <Text color="red" fontSize="bold">
              This link is valid for 15 minutes only!
            </Text>
            <FormControl>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<CFaUserAlt color="gray.300" />}
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  onChange={(e) => setPassword(e.target.value)}
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

export default ResetPassword;
