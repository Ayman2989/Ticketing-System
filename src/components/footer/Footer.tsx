const Footer: React.FC = () => {
  return (
    <footer className="bg-etuwaCustom-wb text-etuwaCustom-db p-4 text-center">
      © {new Date().getFullYear()}, ET Tickets
    </footer>
  );
};

export default Footer;
