import React from 'react';
import { Page, Text, View, Document, Image } from '@react-pdf/renderer';
import { DocumentData } from '@/types/document';
import { styles } from './documentStyles';

// Create Document Component
export const OrderDocument: React.FC<DocumentData> = ({
  company,
  customer,
  order,
}) => {
  return (
    <Document>
      <Page size='A4' style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image style={styles.logo} src='/logo.png' />
            {/* <Text style={styles.companyInfo}>Octosólido</Text>
            <Text style={styles.nifInfo}>NIF: 513 579 559</Text> */}
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.invoiceTitle}>Encomenda</Text>
            <Text>
              Número {order.id} / {order.storeId}
            </Text>
            <Text>{order.date}</Text>
          </View>
        </View>

        {/* Invoice Details */}

        <View style={styles.invoiceDetails}>
          <View style={styles.customerInfo}>
            <Text>Sr.(a) {customer.name}</Text>
            <Text>{`${customer.address.address1}, ${customer.address.address2}`}</Text>
            <Text>{customer.address.postalCode}</Text>
            <Text>{customer.address.city}</Text>
          </View>

          {customer.nif && customer.nif !== '000 000 000' && (
            <View>
              <Text>NIF: {customer.nif}</Text>
            </View>
          )}
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.refColumn]}>Ref.</Text>
          <Text style={[styles.descriptionColumn]}>Designação</Text>
          <Text style={[styles.quantityColumn]}>Quantidade</Text>
          <Text style={[styles.unitPriceColumn]}>Preço Unitário</Text>
          <Text style={[styles.totalColumn]}>Total</Text>
        </View>

        {/* Table Rows */}
        {order.items.map((item, index) => {
          // Calculate the total price for each item by multiplying quantity by unit price
          // We use toFixed(2) to ensure we always show 2 decimal places for currency
          const calculatedTotal = (item.quantity * item.unitPrice).toFixed(2);

          return (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.refColumn]}>{item.ref}</Text>
              <Text style={[styles.descriptionColumn]}>{item.description}</Text>
              <Text style={[styles.quantityColumn]}>{item.quantity}</Text>
              <Text style={[styles.unitPriceColumn]}>
                €{item.unitPrice.toFixed(2)}
              </Text>
              <Text style={[styles.totalColumn]}>€{calculatedTotal}</Text>
            </View>
          );
        })}

        {/* Calculate the total amount for all items */}
        {(() => {
          const calculatedTotalAmount = order.items.reduce((sum, item) => {
            return sum + item.quantity * item.unitPrice;
          }, 0);

          return (
            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text style={styles.vatText}>
                  IVA incluido à taxa em vigor ({order.vat})
                </Text>
                <View style={styles.quantityColumn} />
                <Text style={[styles.unitPriceColumn, { fontWeight: 700 }]}>
                  Total:
                </Text>
                <Text style={[styles.totalColumn, { fontWeight: 700 }]}>
                  €{calculatedTotalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          );
        })()}

        <View style={styles.transferDetails}>
          <Text style={styles.detailsTitle}>Os seus dados</Text>
          <View>
            <Text style={styles.detailsLabel}>Email</Text>
            <Text style={styles.detailsValue}>{customer.email}</Text>
          </View>
          <View>
            <Text style={styles.detailsLabel}>Telefone</Text>
            <Text style={styles.detailsValue}>{customer.phone}</Text>
          </View>
        </View>

        <View style={styles.moreDetailsSection}>
          <View style={styles.deliveryAddressSection}>
            <Text style={styles.deliveryAddressTitle}>Local de Entrega</Text>
            <View>
              <Text style={styles.deliveryAddressValue}>
                {`${customer.address.address1}, ${customer.address.address2}`}
              </Text>
              <Text style={styles.deliveryAddressValue}>
                {customer.address.postalCode}
              </Text>
            </View>
          </View>

          <View style={styles.moreDetailsNotes}>
            {!customer.address.hasElevator && (
              <>
                <Text>Notas</Text>
                <Text>Não há elevador</Text>
              </>
            )}
          </View>
        </View>

        <View wrap={false}>
          <View style={styles.paymentSection}>
            <Text style={styles.paymentTitle}>Nas seguintes condições</Text>

            <View wrap={false} style={styles.paymentTable}>
              <View style={styles.paymentTableHeader}>
                <View style={styles.valueColumn}>
                  <Text style={styles.headerText}>Valor</Text>
                </View>
                <View style={styles.paymentMethodColumn}>
                  <Text style={styles.headerText}>Meio de Pagamento</Text>
                </View>
                <View style={styles.dateColumn}>
                  <Text style={styles.headerText}>Data</Text>
                </View>
              </View>

              {[1, 2, 3, 4].map((_, index) => (
                <View key={index} style={styles.paymentTableRow}>
                  <View style={styles.valueColumn}>
                    <Text style={styles.cellText}> </Text>
                  </View>
                  <View style={styles.paymentMethodColumn}>
                    <Text style={styles.cellText}> </Text>
                  </View>
                  <View style={styles.dateColumn}>
                    <Text style={styles.cellText}> </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.signatureSection}>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureHeaders}>O cliente</Text>
              <View style={styles.signatureLine} />
            </View>
            <View style={styles.signatureBlock}>
              <Text style={styles.signatureHeaders}>Pela firma</Text>
              <View style={styles.signatureLine} />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View
          fixed
          style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
        >
          {/* <Text style={styles.footerRight}>1</Text> TODO: Fix Pagination */}

          <Text style={styles.footer}>Obrigado por confiar na Octosólido.</Text>
          <Text style={styles.footerCompanyInfo}>
            {`${company.designacaoSocial} | NIF: ${company.NIF}`}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
