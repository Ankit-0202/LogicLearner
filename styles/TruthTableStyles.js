// styles/TruthTableStyles.js

import { StyleSheet } from 'react-native';

const TruthTableStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  errorContainer: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
  },
  errorText: {
    color: 'red',
    fontSize: 18,
  },
  headerCell: {
    minWidth: 80,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  cell: {
    minWidth: 80,
    justifyContent: 'center',
    paddingVertical: 8,
  },
});

export default TruthTableStyles;
