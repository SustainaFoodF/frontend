import { jsPDF } from "jspdf";
import { useState } from "react";
import TaskCreationForm from '../Business/TaskCreationForm';




export default function CommandBusinessView({ data }) {
  const [isLoading, setIsLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedCommand, setSelectedCommand] = useState(null);

  const calculateTotal = (command) =>
    command.products.reduce(
      (sum, item) => sum + item?.product.prix * item.quantity,
      0
    );

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const generatePDF = () => {
    setIsLoading(true);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Order List", 20, 20);

    const headers = ["Client", "Products", "Delivery Date", "Total Price"];
    doc.setFontSize(12);
    let headerY = 40;
    headers.forEach((header, index) => {
      doc.text(header, 20 + index * 50, headerY);
    });

    let y = 50;
    data.forEach((command) => {
      const client = command.owner.name;
      const products = command.products
        .map(
          (p) =>
            `${p?.product.label} (${p?.product.prix.toFixed(2)} x ${p?.quantity})`
        )
        .join(", ");
      const deliveryDate = formatDate(command.dateLivraison);
      const total = calculateTotal(command).toFixed(2) + " Dt";

      const row = [client, products, deliveryDate, total];
      row.forEach((text, index) => {
        doc.text(text, 20 + index * 50, y);
      });

      y += 10;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });

    doc.save("orders.pdf");
    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
        <button
          onClick={generatePDF}
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#813e24")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#a04e2e")}
        >
          {isLoading ? "Generating..." : "📦 Download PDF"}
        </button>
        {isLoading && <p style={styles.loadingText}>Please wait...</p>}
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Client</th>
              <th style={styles.th}>Products</th>
              <th style={styles.th}>Delivery Date</th>
              <th style={styles.th}>Total Price (Dt)</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((command, i) => (
              <tr
                key={i}
                style={{
                  backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#ffffff",
                }}
              >
                <td style={styles.td}>{command.owner.name}</td>
                <td style={styles.td}>
                  <ul style={{ margin: 0, paddingLeft: "16px" }}>
                    {command.products.map((p, k) => (
                      <li key={k}>
                        {p?.product.label} / {p?.product.prix.toFixed(2)} x {p.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={styles.td}>{formatDate(command.dateLivraison)}</td>
                <td style={styles.td}>{calculateTotal(command).toFixed(2)}</td>
                <td style={styles.td}>
                  <button  style={styles.button} 
                  onMouseOver={(e) => (e.target.style.backgroundColor = "#813e24")}
                  onMouseOut={(e) => (e.target.style.backgroundColor = "#a04e2e")}
                  onClick={() => {
                    setSelectedCommand(command);
                    setShowTaskForm(true);
                  }}
                  className="assign-button"
                >
                  Create Delivery Task
                </button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {showTaskForm && (
  <div className="modal-overlay">
    <div className="modal-content">
      <button onClick={() => setShowTaskForm(false)} className="close-button">
        ×
      </button>
      <TaskCreationForm 
      command={selectedCommand} 
      onClose={() => setShowTaskForm(false)}
    />
    </div>
  </div>
)}
      </div>
    </div>
  );
}

// 🎨 Centralized styles
const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  buttonContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 25px",
    backgroundColor: "#a04e2e", // brown
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "16px",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  loadingText: {
    marginTop: "10px",
    color: "#a04e2e",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
  },
  theadRow: {
    backgroundColor: "#a04e2e",
    color: "white",
  },
  th: {
    padding: "12px",
    borderBottom: "2px solid #ddd",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
    verticalAlign: "top",
  },
};
