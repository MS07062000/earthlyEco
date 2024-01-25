interface MessageProps {
    type: 'success' | 'info' | 'error';
    message: string;
}

const Message: React.FC<MessageProps> = ({ type, message }) => {
    let bgColor, borderColor, textColor, iconColor;

    switch (type) {
        case 'success':
            bgColor = 'bg-green-50';
            borderColor = 'border-green-300';
            textColor = 'text-green-800';
            iconColor = 'fill-current text-green-500';
            break;
        case 'info':
            bgColor = 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700';
            borderColor = 'border-blue-300';
            textColor = 'text-white';
            iconColor = 'fill-current text-white';
            break;
        case 'error':
            bgColor = 'bg-red-50';
            borderColor = 'border-red-300';
            textColor = 'text-red-800';
            iconColor = 'fill-current text-red-500';
            break;
        default:
            bgColor = 'bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700';
            borderColor = 'border-blue-300';
            textColor = 'text-white';
            iconColor = 'fill-current text-white';
            break;
    }

    return (
        <div className={`w-full flex items-center p-4 mb-4 text-sm ${textColor} border ${borderColor} rounded-lg ${bgColor}`} role="alert">
            <svg className="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill={iconColor} viewBox="0 0 20 20">
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
                <span className="font-medium">{message}</span>
            </div>
        </div>
    );
}

export default Message;
