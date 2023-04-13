import { Pagination } from "react-bootstrap";

const active = 1;
// eslint-disable-next-line
const items: any[] = [];
for (let number = 1; number <= 2; number++) {
  items.push(
    <Pagination.Item key={number} active={number === active}>
      {number}
    </Pagination.Item>
  );
}
export const PaginationBasic: React.FC = () => {
  return (
    <div>
      <Pagination>{items}</Pagination>
      <br />
    </div>
  );
};
