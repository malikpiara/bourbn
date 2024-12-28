import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
import { DocumentData } from '@/types/document';

Font.register({
  family: 'Geist',
  fonts: [
    {
      src: '/fonts/Geist-Regular.ttf',
      fontWeight: 400, // normal
    },
    {
      src: '/fonts/Geist-Medium.ttf',
      fontWeight: 700, // bold
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Geist',
    fontSize: 10,
    lineHeight: 1.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  headerLeft: {
    flexDirection: 'column',
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end', // This will right-align the text
  },
  logo: {
    width: 140, // Adjust width as needed
  },
  companyInfo: {
    fontSize: 12,
    fontWeight: 700,
  },
  nifInfo: {
    fontSize: 10,
    marginTop: 5,
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 5,
  },
  invoiceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  customerInfo: {
    width: '50%',
  },
  invoiceNumberDate: {
    width: '50%',
    textAlign: 'right',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottom: 1,
    borderColor: '#000',
    padding: 5,
    fontWeight: 700,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: 1,
    borderColor: '#e2e8f0',
    padding: 5,
  },
  tableColumn: {
    flex: 1,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  totalLabel: {
    width: '70%',
    textAlign: 'right',
    paddingRight: 10,
  },
  totalAmount: {
    width: '30%',
    textAlign: 'right',
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 30,
    right: 30,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  },

  footerRight: {
    position: 'absolute',
    bottom: 10,
    right: 20,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  },

  footerCompanyInfo: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    fontSize: 8,
    textAlign: 'center',
    color: '#666',
  },

  moreDetailsSection: {
    flexDirection: 'row',
  },

  moreDetailsNotes: {
    padding: '10px',
  },

  transferDetails: {
    marginTop: '20px',
    padding: '10px',
    backgroundColor: '#f1f5f9',
    borderRadius: '3px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },
  detailsLabel: {
    fontSize: 10,
    fontWeight: 700,
  },
  detailsValue: {
    fontSize: 10,
  },

  deliveryAddressSection: {
    width: '200px',
    padding: '10px',
    backgroundColor: '#f1f5f9',
    borderRadius: '3px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  deliveryAddressTitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 10,
  },
  deliveryAddressLabel: {
    fontSize: 10,
    fontWeight: 700,
  },
  deliveryAddressValue: {
    fontSize: 10,
  },

  signatureSection: {
    marginTop: '20px',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  signatureBlock: {
    flexDirection: 'column',
    alignItems: 'center', // Centers the content horizontally
    width: '200px', // Fixed width for each signature block
  },
  signatureHeaders: {
    marginBottom: '10px',
    fontWeight: 700,
    fontSize: 10,
  },
  signatureLine: {
    borderBottom: 1,
    borderColor: '#000',
    width: '100%', // Makes the line take full width of its container
    marginTop: 20,
  },

  paymentSection: {
    marginTop: 30,
    marginBottom: 30,
  },
  paymentTitle: {
    fontSize: 12,
    marginBottom: 15,
    fontWeight: 700,
  },
  paymentTable: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#e2e8f0', // Lighter border color
    borderRadius: '3px', // Match other sections' border radius
  },
  paymentTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9', // Match other sections' background
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  valueColumn: {
    flex: 1,
    padding: 10, // Slightly more padding
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  dateColumn: {
    flex: 1,
    padding: 10,
  },
  paymentTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerText: {
    fontWeight: 700,
    fontSize: 10,
  },
  cellText: {
    height: 8,
  },
});

// Create Document Component
export const MyDocument: React.FC<DocumentData> = ({
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
          <Text style={[styles.tableColumn, { flex: 0.5 }]}>Ref.</Text>
          <Text style={[styles.tableColumn, { flex: 2 }]}>Designação</Text>
          <Text style={styles.tableColumn}>Quantidade</Text>
          <Text style={styles.tableColumn}>Preço Unitário</Text>
          <Text style={styles.tableColumn}>Total</Text>
        </View>

        {/* Table Rows */}
        {order.items.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={[styles.tableColumn, { flex: 0.5 }]}>{item.ref}</Text>
            <Text style={[styles.tableColumn, { flex: 2 }]}>
              {item.description}
            </Text>
            <Text style={styles.tableColumn}>{item.quantity}</Text>
            <Text style={styles.tableColumn}>€{item.unitPrice.toFixed(2)}</Text>
            <Text style={styles.tableColumn}>€{item.total.toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.totalSection}>
          <Text>IVA incluido à taxa em vigor ({order.vat})</Text>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>
            €{order.totalAmount.toFixed(2)}
          </Text>
        </View>

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

        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Nas seguintes condições</Text>

          <View style={styles.paymentTable}>
            <View style={styles.paymentTableHeader}>
              <View style={styles.valueColumn}>
                <Text style={styles.headerText}>Valor</Text>
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
