import hashlib
import io
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from cryptography import x509
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.serialization import pkcs7
from cryptography.x509.oid import NameOID

ASSETS = Path(__file__).with_name("wallet_assets")


def wallet_signer():
    paths = [os.getenv("WALLET_" + field) for field in ("CERT_FILE", "KEY_FILE", "WWDR_FILE")]
    if not all(paths):
        return None
    cert, key, chain = (Path(path).read_bytes() for path in paths)
    password = os.getenv("WALLET_KEY_PASSWORD")
    certificate = x509.load_pem_x509_certificate(cert)
    intermediate = x509.load_pem_x509_certificate(chain)
    private_key = serialization.load_pem_private_key(key, password.encode() if password else None)
    identifier = os.environ["WALLET_PASS_TYPE_ID"]
    team = os.environ["WALLET_TEAM_ID"]
    if certificate.subject.get_attributes_for_oid(NameOID.USER_ID)[0].value != identifier:
        raise ValueError("Wallet certificate does not match pass type")
    if certificate.subject.get_attributes_for_oid(NameOID.ORGANIZATIONAL_UNIT_NAME)[0].value != team:
        raise ValueError("Wallet certificate does not match team")
    now = datetime.now(timezone.utc)
    if any(not cert.not_valid_before_utc <= now <= cert.not_valid_after_utc for cert in (certificate, intermediate)):
        raise ValueError("Wallet certificate is outside its validity period")
    certificate.verify_directly_issued_by(intermediate)
    if certificate.public_key() != private_key.public_key():
        raise ValueError("Wallet private key does not match certificate")
    return certificate, private_key, intermediate, identifier, team


def build_pass(member, signer):
    certificate, key, intermediate, identifier, team = signer
    payload = {
        "formatVersion": 1,
        "passTypeIdentifier": identifier,
        "teamIdentifier": team,
        "serialNumber": member.code,
        "organizationName": "Lumi Lane",
        "description": "Lumi Lane Coffee Club member card",
        "logoText": "Lumi Lane",
        "backgroundColor": "rgb(42, 29, 23)",
        "foregroundColor": "rgb(255, 240, 223)",
        "labelColor": "rgb(242, 179, 148)",
        "storeCard": {
            "primaryFields": [{"key": "club", "label": "MEMBERSHIP", "value": "Coffee Club"}],
            "secondaryFields": [{"key": "name", "label": "MEMBER", "value": member.name}],
            "backFields": [{"key": "number", "label": "MEMBER NUMBER", "value": member.code}],
        },
        "barcodes": [
            {"format": format, "message": member.code, "messageEncoding": "iso-8859-1", "altText": member.code}
            for format in ("PKBarcodeFormatCode128", "PKBarcodeFormatQR")
        ],
    }
    files = {"pass.json": json.dumps(payload, ensure_ascii=False).encode("utf-8")}
    for filename in ("icon.png", "icon@2x.png", "icon@3x.png"):
        files[filename] = (ASSETS / filename).read_bytes()
    manifest = json.dumps({
        name: hashlib.sha1(data, usedforsecurity=False).hexdigest() for name, data in files.items()
    }).encode()
    signature = (
        pkcs7.PKCS7SignatureBuilder()
        .set_data(manifest)
        .add_signer(certificate, key, hashes.SHA256())
        .add_certificate(intermediate)
        .sign(serialization.Encoding.DER, [pkcs7.PKCS7Options.DetachedSignature, pkcs7.PKCS7Options.Binary])
    )
    bundle = io.BytesIO()
    with ZipFile(bundle, "w", compression=ZIP_DEFLATED) as archive:
        for name, data in files.items():
            archive.writestr(name, data)
        archive.writestr("manifest.json", manifest)
        archive.writestr("signature", signature)
    return bundle.getvalue()
