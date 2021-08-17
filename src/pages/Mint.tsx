import React, { useState } from "react";
import {
  Heading,
  Flex,
  Box,
  FormControl,
  Button,
  Input,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import tokenApi from "../api/token";
import asset from "../api/asset";

export const Mint = () => {
  const { handleSubmit, register } = useForm();
  const [loading, setLoading] = useState(false);
  const [imageForm, setImageForm] = useState(false);
  const [complete, setComplete] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { asset, txHash } = await tokenApi.put(
        data.productCode,
        data.caseId,
        data.locationId,
        data.taxCode,
        data.conditionCode,
        data.year,
        data.name,
        data.supply
      );
      setProductIdentifier(asset.productIdentifier);
      setTxHash(txHash);
      setImageForm(true);
    } catch (e) {
      window.alert("There was an error minting the token");
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const [selectedFile, setSelectedFile] = useState<any>();
  const [productIdentifier, setProductIdentifier] = useState<string>();
  const [txHash, setTxHash] = useState("");

  // On file select (from the pop up)
  const onFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = async () => {
    const formData = new FormData();
    formData.append("image", selectedFile, selectedFile.name);
    await asset.image(productIdentifier as string, formData);
    setComplete(true);
  };

  return (
    <>
      {!imageForm ? (
        <Flex style={{ minHeight: "90vh" }} direction="column" px="2rem">
          <Box alignSelf="center" bg="white" rounded="2px" width="450px" my="6">
            <Box
              alignContent="center"
              pt="0"
              mt="0"
              roundedTop="7px"
              marginBottom="10px"
              flexDirection="row"
            >
              <Heading
                textAlign="center"
                alignSelf="center"
                pt="5"
                mt="10px"
                verticalAlign="center"
                fontWeight="500"
              >
                Mint
              </Heading>
            </Box>
            <Box>
              <Flex d="column" align="center" pt="5" flexWrap="wrap">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <FormControl>
                    <Stack>
                      <Input
                        id="name"
                        type="text"
                        backgroundColor="gray.200"
                        fontSize="1rem"
                        rounded="7px"
                        border="none"
                        placeholder="Name"
                        {...register("name")}
                      />
                      <Input
                        id="year"
                        type="text"
                        backgroundColor="gray.200"
                        fontSize="1rem"
                        rounded="7px"
                        border="none"
                        placeholder="Year"
                        {...register("year")}
                      />
                      <Input
                        id="productCode"
                        type="text"
                        backgroundColor="gray.200"
                        fontSize="1rem"
                        rounded="7px"
                        border="none"
                        placeholder="Product Code"
                        {...register("productCode")}
                      ></Input>
                      <Input
                        id="caseId"
                        type="text"
                        backgroundColor="gray.200"
                        rounded="7px"
                        border="none"
                        fontSize="1rem"
                        placeholder="Case ID"
                        {...register("caseId")}
                      />
                      <Input
                        id="locationId"
                        type="text"
                        backgroundColor="gray.200"
                        rounded="7px"
                        border="none"
                        fontSize="1rem"
                        placeholder="Location ID"
                        {...register("locationId")}
                      />
                      <Input
                        id="taxCode"
                        type="text"
                        backgroundColor="gray.200"
                        rounded="7px"
                        border="none"
                        fontSize="1rem"
                        placeholder="Tax Code"
                        {...register("taxCode")}
                      />
                      <Input
                        id="conditionCode"
                        type="text"
                        backgroundColor="gray.200"
                        rounded="7px"
                        border="none"
                        fontSize="1rem"
                        placeholder="Condition Code"
                        {...register("conditionCode")}
                      />
                      <Input
                        id="supply"
                        type="number"
                        backgroundColor="gray.200"
                        rounded="7px"
                        border="none"
                        fontSize="1rem"
                        placeholder="Supply"
                        {...register("supply")}
                      />
                      <Button
                        variantColor="blue"
                        type="submit"
                        border="none"
                        width="80%"
                        isLoading={loading}
                        style={{ alignSelf: "center" }}
                      >
                        Submit
                      </Button>
                    </Stack>
                  </FormControl>
                </form>
              </Flex>
            </Box>
          </Box>
        </Flex>
      ) : (
        <>
          {complete ? (
            <Box>
              <Heading alignSelf="center">Mint complete</Heading>
              <text>{`https://kovan.etherscan.io/tx/${txHash}`}</text>
            </Box>
          ) : (
            <Flex style={{ minHeight: "90vh" }} direction="column" px="2rem">
              <Box
                alignSelf="center"
                bg="white"
                rounded="2px"
                width="450px"
                my="6"
              >
                <Box
                  alignContent="center"
                  pt="0"
                  mt="0"
                  roundedTop="7px"
                  marginBottom="10px"
                  flexDirection="row"
                >
                  <Heading
                    textAlign="center"
                    alignSelf="center"
                    pt="5"
                    mt="10px"
                    verticalAlign="center"
                    fontWeight="500"
                  >
                    Mint
                  </Heading>
                </Box>
                <Box>
                  <div>
                    <VStack>
                      <input type="file" onChange={onFileChange} />
                      <Button onClick={onFileUpload}>Upload</Button>
                    </VStack>
                  </div>
                </Box>
              </Box>
            </Flex>
          )}
        </>
      )}
    </>
  );
};
export default Mint;
