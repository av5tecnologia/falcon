import React from 'react';
import { Formik } from 'formik';
import { T } from '@deity/falcon-i18n';
import { H1, Text, Button, FlexLayout, GridLayout } from '@deity/falcon-ui';
import {
  Form,
  FormField,
  CheckboxFormField,
  FormErrorSummary,
  AddressQuery,
  GET_ADDRESS,
  EditAddressMutation,
  TwoColumnsLayout,
  TwoColumnsLayoutArea,
  CountriesQuery,
  CountrySelector
} from '@deity/falcon-ecommerce-uikit';

const EditAddress = ({ match, history }) => {
  const id = parseInt(match.params.id, 10);

  return (
    <AddressQuery variables={{ id }}>
      {({ address }) => (
        <GridLayout mb="md" gridGap="md">
          <H1>
            <T id="editAddress.title" />
          </H1>

          {(address.defaultBilling || address.defaultShipping) && (
            <Text>
              <T
                id="editAddress.defaultAddressLabel"
                context={[
                  address.defaultBilling ? 'billing' : undefined,
                  address.defaultShipping ? 'shipping' : undefined
                ]
                  .filter(x => x)
                  .join('&')}
              />
            </Text>
          )}
          <EditAddressMutation refetchQueries={['Addresses', { query: GET_ADDRESS, variables: { id } }]}>
            {(editAddress, { loading, error }) => (
              <Formik
                initialValues={{
                  firstname: address.firstname,
                  lastname: address.lastname,
                  street: address.street[0],
                  postcode: address.postcode,
                  city: address.city,
                  countryId: address.countryId,
                  company: address.company || undefined,
                  telephone: address.telephone,
                  defaultBilling: address.defaultBilling,
                  defaultShipping: address.defaultShipping
                }}
                onSubmit={values =>
                  editAddress({
                    variables: {
                      input: {
                        ...values,
                        id,
                        street: [values.street]
                      }
                    }
                  }).then(() => history.push('/account/address-book'))
                }
              >
                {() => (
                  <Form id={id} i18nId="editAddress">
                    {address.defaultBilling === false && <CheckboxFormField name="defaultBilling" />}
                    {address.defaultShipping === false && <CheckboxFormField name="defaultShipping" />}
                    <TwoColumnsLayout>
                      <GridLayout gridArea={TwoColumnsLayoutArea.left}>
                        <FormField name="company" />
                        <FormField name="firstname" required />
                        <FormField name="lastname" required />
                        <FormField name="telephone" />
                      </GridLayout>
                      <GridLayout gridArea={TwoColumnsLayoutArea.right}>
                        <FormField name="street" required />
                        <FormField name="postcode" required />
                        <FormField name="city" required />
                        <FormField name="countryId" required>
                          {({ form, field }) => (
                            <CountriesQuery passLoading>
                              {({ countries = { items: [] } }) => (
                                <CountrySelector
                                  {...field}
                                  onChange={x => form.setFieldValue(field.name, x)}
                                  items={countries.items}
                                />
                              )}
                            </CountriesQuery>
                          )}
                        </FormField>
                      </GridLayout>
                    </TwoColumnsLayout>
                    <FlexLayout justifyContent="flex-end" alignItems="center" mt="md">
                      <FormErrorSummary errors={error && [error.message]} />
                      <Button type="submit" variant={loading ? 'loader' : undefined}>
                        <T id="editAddress.submitButton" />
                      </Button>
                    </FlexLayout>
                  </Form>
                )}
              </Formik>
            )}
          </EditAddressMutation>
        </GridLayout>
      )}
    </AddressQuery>
  );
};

export default EditAddress;
