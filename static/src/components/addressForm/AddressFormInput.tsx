interface InputProps {
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    type?: string;
    pattern?: string;
}

const Input: React.FC<InputProps> = ({ id, label, value, onChange, required, type, pattern }) => {
    return (
        <div key={id} className="space-y-2">
            <label className="text-sm font-medium text-black" htmlFor={id}>{label}</label>
            <input
                className="bg-gray-50 border border-gray-300 text-black sm:text-sm rounded-lg focus:ring-black focus:border-black block w-full p-2.5"
                id={id}
                placeholder={`Enter your ${label.toLowerCase()}`}
                value={value}
                onChange={onChange}
                required={required}
                type={type}
                pattern={pattern}
            />
        </div>
    );
};

export default Input;