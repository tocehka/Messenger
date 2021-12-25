from random import randint

def generate_hex(max_value):
    generated_value = randint(0, max_value)
    return hex(generated_value).replace("0x", "")

def create_hex_color():
    r = generate_hex(255)
    g = generate_hex(255)
    b = generate_hex(255)

    return f"#{r}{g}{b}"