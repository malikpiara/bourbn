import { Font, StyleSheet } from '@react-pdf/renderer';

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

export const styles = StyleSheet.create({
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
