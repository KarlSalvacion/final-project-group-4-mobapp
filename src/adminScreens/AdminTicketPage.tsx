import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AdminTicketPage = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Support Tickets</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.text}>Admin Ticket Management</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: 'rgb(25, 153, 100)',
    padding: 20,
    paddingTop: 40,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: '#666',
  },
});

export default AdminTicketPage; 