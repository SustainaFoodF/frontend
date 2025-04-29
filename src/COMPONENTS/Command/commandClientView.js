export default function CommandClientView({ data }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Products</th>
          <th>Date de livrasion </th>
          <th>Prix Total</th>
        </tr>
      </thead>
      <tbody>
        {data.map((command, key) => (
          <tr key={key}>
            <td>
              <ul>
                {command.products.map((p, key) => (
                  <li>
                    {p.product.label} / {p.product.owner.name} :{" / "}
                    {p?.product.prix.toFixed(2) + " X " + p?.quantity}{" "}
                  </li>
                ))}
              </ul>
            </td>
            <td>{command.dateLivraison}</td>
            <td>{command.totalPrice.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
