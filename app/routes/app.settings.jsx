import {
  Box,
  Card,
  InlineGrid,
  TextField,
  Page,
  Text,
  BlockStack,
  useBreakpoints,
  Divider,
  Button,
} from "@shopify/polaris";
import { useState } from "react";
import { TitleBar } from "@shopify/app-bridge-react";
import { json } from "@remix-run/node";
import { useLoaderData, Form } from "@remix-run/react";

// This function will be called at build time to get the settings
export async function loader () {


  // This is the placeholder of form data
  const settings = {
    name: "My App",
    description: "My app description"
  }

  // it has to return a JSON object
  return json(settings)
}

// This function will be called when the form is submitted
export async function action({ request }) {

  // save the form data from the request
  let settings = await request.formData();

  // change the settings object to a JSON object
  settings = Object.fromEntries(settings);

  //it has to return a JSON object
  return json(settings);
}

// This is the main component
export default function SettingsPage() {

  // get the settings from the loader
  const settings = useLoaderData();
  // set the initial form state from settings
  const [formState, setFormState] = useState(settings);
 
  // get the screen size
  const { smUp } = useBreakpoints();

  return (
    // layout from settings page from polaries
    <Page>
      <TitleBar title="Settings" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Update app settings and prefferences
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            {/* Form from remix to submit the data */}
            <Form method="post">
              {/* to submit a form the input must to have a name attribute.
              the input change with the state of the formState. */}
              <BlockStack gap="400">
                <TextField 
                  label="App name" 
                  name="name"
                  value={formState.name} 
                  onChange={(value) => setFormState({ ...formState, name: value })} 
                /> 
                <TextField
                  label="Description"
                  name="description"
                  value={formState.description}
                  onChange={(value) => setFormState({ ...formState, description: value })}
                />
                {/* the button must to have the submit property to submit the form */}
                <Button primary submit>Save</Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
        {smUp ? <Divider /> : null}
      </BlockStack>
    </Page>
  );
}
