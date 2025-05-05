import { RadioGroup } from "@headlessui/react";

function User({ user, type }) {
  return (
    <>
      <style>
        {`
          .radio-option {
            display: flex;
            cursor: pointer;
            border-radius: 0.5rem;
            padding: 1.25rem 2.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            outline: none;
          }
          .radio-option-checked {
            background-color: #4F46E5;
            opacity: 0.75;
            color: white;
          }
          .radio-option-unchecked {
            background-color: white;
          }
          .user-content {
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            gap: 1.25rem;
            min-width: 250px;
          }
          .user-label {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            font-weight: 500;
          }
          .user-label-checked {
            color: white;
          }
          .user-label-unchecked {
            color: #111827;
          }
          .user-image {
            object-fit: cover;
            height: 2.5rem;
            width: 2.5rem;
            border-radius: 50%;
          }
          .check-icon-container {
            flex-shrink: 0;
            color: white;
          }
          .check-icon {
            height: 1.5rem;
            width: 1.5rem;
          }
        `}
      </style>
      <RadioGroup.Option
        key={user.id + user.name}
        value={user}
        className={({ checked }) =>
          `radio-option ${checked ? 'radio-option-checked' : 'radio-option-unchecked'}`
        }
      >
        {({ checked }) => (
          <div className="user-content">
            <div className="flex items-center">
              <div className="text-sm">
                <RadioGroup.Label
                  as="div"
                  className={`user-label ${checked ? 'user-label-checked' : 'user-label-unchecked'}`}
                >
                  <img
                    className="user-image"
                    src={user.image}
                    alt={user.name}
                  />
                  {user.name}
                  {user.email}
                </RadioGroup.Label>
              </div>
            </div>
            {checked && (
              <div className="check-icon-container">
                <CheckIcon className="check-icon" />
              </div>
            )}
          </div>
        )}
      </RadioGroup.Option>
    </>
  );
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#fff" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default User;