import { jsPDF } from "jspdf";
import { useState, useMemo } from "react";
import logo from '../../ASSETS/logo.png'; // ✅ Vérifie que ce chemin est correct

export default function CommandClientView({ data }) {
  const [isLoading, setIsLoading] = useState(false);

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const generatePDF = () => {
    setIsLoading(true);
    //const ownerName = data?.[0]?.products?.[0]?.product?.owner?.name || "User";

    const doc = new jsPDF();
    const img = new Image();
    img.src = logo;

    img.onload = () => {
      doc.addImage(img, "PNG", 10, 10, 30, 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text(`My Orders `, 50, 20);

      doc.setFontSize(11);
      const today = new Date().toLocaleDateString("en-GB");
      doc.text(`Date: ${today}`, 50, 28);

      let y = 50;

      data.forEach((command) => {
        doc.setFillColor(245, 245, 245);
        doc.rect(10, y, 190, 30, "F");

        const productLines = command.products.map((p) => {
          const label = p?.product?.label || "N/A";
          const ownerName = p?.product?.owner?.name || "N/A";
          const price = p?.product?.prix?.toFixed(2) || "0.00";
          const quantity = p?.quantity || 0;
          return `${label} / ${ownerName} (${price} x ${quantity})`;
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text("Products:", 15, y + 7);
        doc.setFontSize(11);
        doc.text(doc.splitTextToSize(productLines.join(", "), 180), 25, y + 14);

        doc.text("Delivery Date:", 15, y + 24);
        doc.text(formatDate(command.dateLivraison), 55, y + 24);

        doc.text("Total Price:", 130, y + 24);
        doc.text(`${command.totalPrice.toFixed(2)} Dt`, 170, y + 24, { align: "right" });

        y += 40;
        if (y > 260) {
          doc.addPage();
          y = 20;
        }
      });

      doc.save("my_orders.pdf");
      setIsLoading(false);
    };
  };

  const getRecommendations = (data) => {
    const sellerProducts = {};
    const seen = new Set();

    data.forEach((command) => {
      command.products.forEach(({ product }) => {
        if (!product || !product.owner) return;
        const seller = product.owner.name;
        if (!sellerProducts[seller]) sellerProducts[seller] = [];
        sellerProducts[seller].push(product);
      });
    });

    const allRecommended = [];
    Object.values(sellerProducts).forEach((products) => {
      products.forEach((prod) => {
        if (!seen.has(prod.label)) {
          allRecommended.push(prod);
          seen.add(prod.label);
        }
      });
    });

    return allRecommended.slice(0, 5);
  };

  const recommendations = useMemo(() => getRecommendations(data), [data]);

  return (
    <div style={styles.container}>
      <div style={styles.buttonContainer}>
        <button
          onClick={generatePDF}
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#6c2e1a")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#8c3b22")}
        >
          {isLoading ? "Generating..." : "📄 Download PDF"}
        </button>
        {isLoading && <p style={styles.loadingText}>Please wait...</p>}
      </div>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.theadRow}>
              <th style={styles.th}>Products</th>
              <th style={styles.th}>Delivery Date</th>
              <th style={styles.th}>Total Price (Dt)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((command, key) => (
              <tr
                key={key}
                style={{
                  backgroundColor: key % 2 === 0 ? "#f5f5f5" : "#ffffff",
                }}
              >
                <td style={styles.td}>
                  <ul style={{ margin: 0, paddingLeft: "16px" }}>
                    {command.products.map((p, k) => (
                      <li key={k}>
                        {(p?.product?.label || "N/A")} / {(p?.product?.owner?.name || "N/A")} :{" "}
                        {(p?.product?.prix?.toFixed(2) || "0.00")} x {(p?.quantity || 0)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td style={styles.td}>{formatDate(command.dateLivraison)}</td>
                <td style={styles.td}>{command.totalPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {recommendations.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <h3 style={{ color: "#8c3b22", marginBottom: "15px" }}>
            🛍️ Personalized recommendations
          </h3>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {recommendations.map((prod, idx) => (
              <div
                key={idx}
                style={{
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  width: "200px",
                  padding: "10px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  textAlign: "center",
                }}
              >
                <h4 style={{ fontSize: "16px", margin: "10px 0 5px" }}>
                  {prod.label}
                </h4>
                <p style={{ color: "#8c3b22", fontWeight: "bold" }}>
                  {prod.prix?.toFixed(2)} Dt
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Segoe UI, sans-serif",
  },
  buttonContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 30px",
    backgroundColor: "#8c3b22",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    transition: "all 0.3s ease",
  },
  loadingText: {
    marginTop: "10px",
    color: "#8c3b22",
    fontStyle: "italic",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
    borderRadius: "6px",
    overflow: "hidden",
  },
  theadRow: {
    backgroundColor: "#8c3b22",
    color: "white",
  },
  th: {
    padding: "12px",
    textAlign: "left",
    fontWeight: "bold",
    borderBottom: "2px solid #ddd",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #eee",
    verticalAlign: "top",
    fontSize: "14px",
  },
};
