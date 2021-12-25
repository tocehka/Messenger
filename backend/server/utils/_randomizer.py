from random import randint

def generate_hex(max_value):
    generated_value = randint(0, max_value)
    return hex(generated_value).replace("0x", "")

def create_hex_color():
    r1 = generate_hex(15)
    r2 = generate_hex(15)
    g1 = generate_hex(15)
    g2 = generate_hex(15)
    b1 = generate_hex(15)
    b2 = generate_hex(15)

    return f"#{r1}{r2}{g1}{g2}{b1}{b2}"