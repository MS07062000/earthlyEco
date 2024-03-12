interface SelectProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    required?: boolean;
}

const Select: React.FC<SelectProps> = ({ id, label, value, onChange, options, required }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required={required}
            >
                <option value=''>Choose {label.toLowerCase()}</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );
};

export default Select;