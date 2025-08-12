import Link from "next/link";

const SearchUserItem = ({ user, onClick }: { user: IUser; onClick: () => void }) => {
  return (
    <li className="hover:bg-cards-container transition-colors">
      <Link
        href={`/admin/users/edit-user/${user.userId}`}
        onClick={onClick}
        className="flex flex-col gap-3 items-start px-4 py-2 text-white text-sm"
      >
        <div>
          <h2>{user.name}</h2>
          <h3 className="text-sm text-text-inactive">{user.role.name}</h3>
        </div>
      </Link>
    </li>
  );
};

export default SearchUserItem;
