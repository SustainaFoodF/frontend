export default function CommandBusinessView({ data }) {
  const calculateTotal = (command) => {
    //command.totalPrice.toFixed(2) is not the same as total products of connected shop
    let s = 0;
    command.products.forEach((element) => {
      s = s + element?.product.prix.toFixed(2) * element.quantity;
    });
    return s;
  };
  return (
    <>
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Products</th>
            <th>Date de livrasion </th>
            <th>Prix Total</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((command, key) => (
              <tr key={key}>
                <td>{command.owner.name}</td>
                <td>
                  <ul>
                    {command.products.map((p, key) => (
                      <li key={key}>
                        {p?.product.label} /{" "}
                        {p?.product.prix.toFixed(2) + " X " + p?.quantity}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>{command.dateLivraison}</td>
                <td>{calculateTotal(command)}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}
